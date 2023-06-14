package uk.ac.bham.teamproject.repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import uk.ac.bham.teamproject.domain.StudySession;
import uk.ac.bham.teamproject.domain.UserExtended;

/**
 * Spring Data JPA repository for the StudySession entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, Long> {
    @Query(
        value = "select distinct studySession from StudySession studySession left join fetch studySession.members",
        countQuery = "select count(distinct studySession) from StudySession studySession"
    )
    List<StudySession> findJoin();

    @Query(value = "SELECT distinct studySession FROM StudySession studySession WHERE studySession.isPrivate=false")
    List<StudySession> getStudySesh();

    @Query(value = "SELECT distinct studySession from StudySession studySession where studySession.owner = :friend")
    StudySession getFriendSession(@Param("friend") Long friend);
}
